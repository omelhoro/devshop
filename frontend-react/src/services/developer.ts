import urlJoin from "url-join";

export async function findByName(name: string) {
  const response = await fetch(
    urlJoin(
      process.env.BACKEND_ENDPOINT,
      "api/github",
      "developer",
      `?name=${name}`
    )
  );

  if (response.status === 404) {
    return [];
  }

  if (response.status !== 200) {
    throw response;
  }
  return response.json();
}

export async function findByOrgName(name: string) {
  const response = await fetch(
    urlJoin(
      process.env.BACKEND_ENDPOINT,
      "api/github",
      "members-of-org",
      `?orgName=${name}`
    )
  );

  if (response.status === 404) {
    return [];
  }

  if (response.status !== 200) {
    throw response;
  }
  return response.json();
}

export async function submitOrder(body) {
  const response = await fetch(
    urlJoin(process.env.BACKEND_ENDPOINT, "api/orders"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
  if (response.status !== 200) {
    throw response;
  }
  return response.json();
}

export async function getOrder(token) {
  const response = await fetch(
    urlJoin(process.env.BACKEND_ENDPOINT, "api/orders", token)
  );
  if (response.status !== 200) {
    throw response;
  }
  return response.json();
}
