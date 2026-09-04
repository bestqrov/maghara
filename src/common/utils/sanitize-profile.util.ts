/** Strips guardian (wali) contact fields before a profile is shown to anyone other than its own owner. */
export function omitWaliInfo<T extends Record<string, any>>(profile: T): Omit<T, 'waliName' | 'waliPhone' | 'waliRelationship'> {
  const { waliName, waliPhone, waliRelationship, ...rest } = profile;
  return rest;
}
