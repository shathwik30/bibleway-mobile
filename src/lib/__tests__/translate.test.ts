import { translateText } from "../translate";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeFetchResponse(segments: string[][]) {
  return {
    ok: true,
    json: async () => [segments.map((s) => s)],
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("translateText", () => {
  describe("short-circuits", () => {
    it("returns original text when target language equals source language", async () => {
      const result = await translateText("Hello", "en", "en");
      expect(result).toBe("Hello");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns original text when input is only whitespace", async () => {
      const result = await translateText("   ", "es", "en");
      expect(result).toBe("   ");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns original text when input is empty string", async () => {
      const result = await translateText("", "fr", "en");
      expect(result).toBe("");
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("basic translation", () => {
    it("calls the Google Translate API with correct parameters", async () => {
      mockFetch.mockResolvedValueOnce(
        makeFetchResponse([["Hola mundo", "Hello world"]]),
      );

      await translateText("Hello world", "es", "en");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("translate.googleapis.com");
      expect(url).toContain("sl=en");
      expect(url).toContain("tl=es");
      expect(url).toContain("q=Hello+world");
    });

    it("concatenates segments from the API response", async () => {
      mockFetch.mockResolvedValueOnce(
        makeFetchResponse([
          ["Hola ", "Hello "],
          ["mundo", "world"],
        ]),
      );

      const result = await translateText("Hello world", "es", "en");
      expect(result).toBe("Hola mundo");
    });

    it("defaults source language to en", async () => {
      mockFetch.mockResolvedValueOnce(
        makeFetchResponse([["Bonjour", "Hello"]]),
      );

      await translateText("Hello", "fr");

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("sl=en");
    });
  });

  describe("caching", () => {
    it("returns cached result on second call with same params", async () => {
      mockFetch.mockResolvedValueOnce(makeFetchResponse([["Ciao", "Hello"]]));

      const first = await translateText("Hello", "it", "en");
      const second = await translateText("Hello", "it", "en");

      expect(first).toBe("Ciao");
      expect(second).toBe("Ciao");

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("does not use cache when target language differs", async () => {
      mockFetch
        .mockResolvedValueOnce(makeFetchResponse([["Hola", "Hi"]]))
        .mockResolvedValueOnce(makeFetchResponse([["Salut", "Hi"]]));

      await translateText("Hi", "es", "en");
      await translateText("Hi", "fr", "en");

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("chunk splitting", () => {
    it("sends a single chunk for short text", async () => {
      mockFetch.mockResolvedValueOnce(makeFetchResponse([["Corto", "Short"]]));

      await translateText("Short", "es", "en");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("splits long text into multiple chunks and joins results", async () => {
      const longText = "A".repeat(4500);

      mockFetch
        .mockResolvedValueOnce(makeFetchResponse([["B".repeat(4001)]]))
        .mockResolvedValueOnce(makeFetchResponse([["B".repeat(499)]]));

      const result = await translateText(longText, "es", "en");
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe("B".repeat(4001) + "B".repeat(499));
    });
  });

  describe("error handling", () => {
    it("throws when the API returns a non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({}),
      });

      await expect(translateText("fail", "de", "en")).rejects.toThrow(
        "Translation failed: 503",
      );
    });

    it("returns original text when response format is unexpected", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ unexpected: "format" }),
      });

      const result = await translateText("unchanged", "ja", "en");
      expect(result).toBe("unchanged");
    });
  });
});
