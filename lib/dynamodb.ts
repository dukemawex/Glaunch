import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { awsCredentialsProvider } from '@vercel/functions/oidc'

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME as string
const REGION = process.env.AWS_REGION ?? 'us-east-1'

let docClient: DynamoDBDocumentClient | null = null

/**
 * Returns a singleton DynamoDB DocumentClient.
 * Authenticates with AWS using Vercel OIDC role credentials (AWS_ROLE_ARN).
 * Falls back to the default AWS credential chain when AWS_ROLE_ARN is absent.
 */
export function getClient(): DynamoDBDocumentClient {
  if (docClient) return docClient

  const client = new DynamoDBClient({
    region: REGION,
    ...(process.env.AWS_ROLE_ARN
      ? {
          credentials: awsCredentialsProvider({
            roleArn: process.env.AWS_ROLE_ARN,
            clientConfig: { region: REGION },
          }),
        }
      : {}),
  })

  docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  })

  return docClient
}

/* ------------------------------------------------------------------ */
/* Single-table key helpers                                            */
/* ------------------------------------------------------------------ */

export const keys = {
  userPk: (userId: string) => `USER#${userId}`,
  userProfileSk: () => 'PROFILE',
  resumeSk: (resumeId: string) => `RESUME#${resumeId}`,
  applicationSk: (applicationId: string) => `APPLICATION#${applicationId}`,
  matchSk: (matchId: string) => `MATCH#${matchId}`,
  sessionSk: (sessionId: string) => `SESSION#${sessionId}`,
  jobPk: (jobId: string) => `JOB#${jobId}`,
  jobSk: (source: string) => `SOURCE#${source}`,
}

export const GSI1_NAME = 'GSI1'
export const JOB_GSI1PK = 'JOB'

/* ------------------------------------------------------------------ */
/* Generic single-table operations                                     */
/* ------------------------------------------------------------------ */

export async function putItem(item: Record<string, unknown>): Promise<void> {
  await getClient().send(
    new PutCommand({ TableName: TABLE_NAME, Item: item }),
  )
}

export async function getItem<T = Record<string, unknown>>(
  pk: string,
  sk: string,
): Promise<T | null> {
  const result = await getClient().send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: pk, SK: sk } }),
  )
  return (result.Item as T) ?? null
}

/**
 * Query all items for a partition key, optionally filtered by an SK prefix.
 */
export async function queryByPK<T = Record<string, unknown>>(
  pk: string,
  skPrefix?: string,
): Promise<T[]> {
  const result = await getClient().send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: skPrefix
        ? '#pk = :pk AND begins_with(#sk, :sk)'
        : '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        ...(skPrefix ? { '#sk': 'SK' } : {}),
      },
      ExpressionAttributeValues: {
        ':pk': pk,
        ...(skPrefix ? { ':sk': skPrefix } : {}),
      },
    }),
  )
  return (result.Items as T[]) ?? []
}

/**
 * Query the GSI1 index. Used to list all jobs (GSI1PK = "JOB").
 */
export async function queryGSI<T = Record<string, unknown>>(
  gsi1pk: string,
): Promise<T[]> {
  const result = await getClient().send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI1_NAME,
      KeyConditionExpression: '#gpk = :gpk',
      ExpressionAttributeNames: { '#gpk': 'GSI1PK' },
      ExpressionAttributeValues: { ':gpk': gsi1pk },
    }),
  )
  return (result.Items as T[]) ?? []
}

/**
 * Patch attributes on an existing item. Reserved-word safe.
 */
export async function updateItem<T = Record<string, unknown>>(
  pk: string,
  sk: string,
  updates: Record<string, unknown>,
): Promise<T | null> {
  const entries = Object.entries(updates).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return getItem<T>(pk, sk)

  const names: Record<string, string> = {}
  const values: Record<string, unknown> = {}
  const sets: string[] = []

  entries.forEach(([key, value], i) => {
    names[`#k${i}`] = key
    values[`:v${i}`] = value
    sets.push(`#k${i} = :v${i}`)
  })

  const result = await getClient().send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `SET ${sets.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }),
  )
  return (result.Attributes as T) ?? null
}
