test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const version = responseBody.dependencies.database.version;
  const maxConnections = responseBody.dependencies.database.max_connections;
  const openedConnections =
    responseBody.dependencies.database.opened_connections;

  expect(version).toEqual("16.0");
  expect(maxConnections).toEqual(100);
  expect(maxConnections).toBeLessThan(maxConnections + 1);
  expect(openedConnections).toEqual(1);

  // expect(
  //   responseBody.dependencies.database.current_connections,
  // ).toBeGreaterThanOrEqual(1);

  // expect(
  //   responseBody.dependencies.database.current_connections,
  // ).toBeLessThanOrEqual(responseBody.dependencies.database.max_connections);
});
