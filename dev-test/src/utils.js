import { flowConfig } from "@onflow/fcl-config";
import { config } from "@onflow/config";

export const get = (scope, path, fallback) => {
    if (typeof path === "string") return get(scope, path.split("/"), fallback);
    if (!path.length) return scope;
    try {
        const [head, ...rest] = path;
        return get(scope[head], rest, fallback);
    } catch (_error) {
        return fallback;
    }
};

export const set = (key, env, conf, fallback) => {
    config().put(key, env || get(flowConfig(), conf, fallback));
};

export const init = () => {
    set("PRIVATE_KEY", process.env.PK, "accounts/emulator-account/keys");
    set(
        "SERVICE_ADDRESS",
        process.env.SERVICE_ADDRESS,
        "accounts/emulator-account/address",
        "f8d6e0586b0a20c7",
    );
}

export const sansPrefix = (address) => {
    if (address == null) return null;
    return address.replace(/^0x/, "");
};

export const withPrefix = (address) => {
    if (address == null) return null;
    return "0x" + sansPrefix(address);
};