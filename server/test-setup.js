import { beforeAll, vi, beforeEach } from "vitest";
import { connect } from "./DB_Interface";

beforeAll(() => {
  connect(":memory:");
});

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        id: "test-chat-id",
        msg: {
          choices: [{ message: { content: "Default Mock Response" } }],
        },
      }),
  });
});

export { fetchMock };
