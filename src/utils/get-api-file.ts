export function getApiFile(url: string) {
  return process.env.EXPO_PUBLIC_API_URL?.replaceAll("graphql", url);
}
