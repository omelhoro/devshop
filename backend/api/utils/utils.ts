export function errorHandler(res, status: number, msg: string) {
  console.error("APIERROR", new Date().toJSON(), msg);
  res.status(status || 500);
  res.send({
    value: msg
  });
}

export function calculateHoursPrice(developer) {
  const years =
    (new Date().getUTCFullYear() -
      new Date(developer.created_at).getUTCFullYear()) *
    2;
  const publicRepos = developer.public_repos / 5;
  const publicGists = developer.public_gists / 4;
  const followers = developer.followers / 4;
  return Math.floor(years + publicRepos + publicGists + followers);
}
