export const getAssetIcon = async (symbol: string, type: string): Promise<string> => {
    switch (type) {
        case "STOCK":
            const domain = await mapStockToDomain(symbol);
            return `https://logo.clearbit.com/${domain}`;
        case "FUTURES":
            return `/futures/${symbol}.png`; // host your own icons
        case "CRYPTO":
            return `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/64`; // alt: CoinGecko
        case "FOREX": {
            const [base, quote] = symbol.includes("/")
                ? symbol.split("/")
                : [symbol.slice(0, 3), symbol.slice(3, 6)];
            const countryCode = await mapCurrencyToCountry(base);
            return `https://flagcdn.com/w40/${countryCode}.png`;
        }
        default:
            return "/default-icon.png";
    }
};

// ✅ Static cache for common tickers
const localStockToDomain: Record<string, string> = {
    AAPL: "apple.com",
    MSFT: "microsoft.com",
    GOOGL: "google.com",
    TSLA: "tesla.com",
    AMZN: "amazon.com",
    META: "facebook.com",
    NFLX: "netflix.com",
    NVDA: "nvidia.com",
    JPM: "jpmorganchase.com",
    BAC: "bankofamerica.com",
    WMT: "walmart.com",
    DIS: "disney.com"
};

// ✅ In-memory cache for API lookups
const dynamicStockDomainCache: Record<string, string> = {};

// ✅ Static cache for common currencies
const localCurrencyToCountry: Record<string, string> = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    CHF: "ch",
    AUD: "au",
    CAD: "ca",
    NZD: "nz",
    CNY: "cn",
    HKD: "hk",
    SGD: "sg",
    SEK: "se",
    NOK: "no",
    MXN: "mx",
    ZAR: "za",
    TRY: "tr",
    INR: "in",
    KRW: "kr",
    RUB: "ru",
    BRL: "br"
};

// ✅ In-memory cache for API lookups
const dynamicCurrencyCountryCache: Record<string, string> = {};

const mapStockToDomain = async (symbol: string): Promise<string> => {
    const upperSymbol = symbol.toUpperCase();

    if (localStockToDomain[upperSymbol]) {
        return localStockToDomain[upperSymbol];
    }

    if (dynamicStockDomainCache[upperSymbol]) {
        return dynamicStockDomainCache[upperSymbol];
    }

    try {
        const data = await fetchWithAuth("/stock-domain", {
            method: "POST",
            body: JSON.stringify({ symbol: upperSymbol })
        });

        dynamicStockDomainCache[upperSymbol] = data.domain;
        return data.domain;
    } catch (error) {
        console.error(`❌ Stock domain lookup error for ${symbol}:`, error);
        return "example.com";
    }
};

const mapCurrencyToCountry = async (currency: string): Promise<string> => {
    const upperCurrency = currency.toUpperCase();

    // Check static cache first
    if (localCurrencyToCountry[upperCurrency]) {
        return localCurrencyToCountry[upperCurrency];
    }

    // Check dynamic cache
    if (dynamicCurrencyCountryCache[upperCurrency]) {
        return dynamicCurrencyCountryCache[upperCurrency];
    }

    try {
        const response = await fetch(
            `https://restcountries.com/v3.1/currency/${upperCurrency}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch currency data');
        }

        const data = await response.json();
        if (data && data[0] && data[0].cca2) {
            const countryCode = data[0].cca2.toLowerCase();
            dynamicCurrencyCountryCache[upperCurrency] = countryCode;
            return countryCode;
        }

        return "xx"; // fallback
    } catch (error) {
        console.error(`❌ Currency lookup error for ${currency}:`, error);
        return "xx"; // fallback
    }
};