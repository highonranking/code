// Shared storage for all API routes
// In production, replace this with a database (MongoDB, PostgreSQL, etc.)

export const sharedProjects = {};

export function getProject(shareName) {
  return sharedProjects[shareName];
}

export function setProject(shareName, project) {
  sharedProjects[shareName] = project;
}

export function deleteProject(shareName) {
  delete sharedProjects[shareName];
}

export function projectExists(shareName) {
  return !!sharedProjects[shareName];
}
