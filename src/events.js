import { send, getEventsAtBlockHeightRange, decode } from "@onflow/fcl";
import { sansPrefix } from "./address";
import { CURRENT_SPORK_ROOT } from "./const";
import { getChainHeight } from "./chain";

export const getEventName = (event) => {
  const { address, contractName, eventName } = event;
  return `A.${sansPrefix(address)}.${contractName}.${eventName}`;
};

export const ERR_NO_ACCOUNT = "contract shall have address field";
export const ERR_NO_CONTRACT = "contract shall have contractName field";
export const ERR_NO_EVENT_NAME = "contract shall have event name";
const MAX_BLOCK_OFFSET = 249;

export const getEventsInRange = async (event, range) => {
  if (!event.address) throw ERR_NO_ACCOUNT;
  if (!event.contractName) throw ERR_NO_CONTRACT;
  if (!event.eventName) throw ERR_NO_EVENT_NAME;

  let fromRange, toRange;
  if (!range) {
    // TODO: fetch latest block
    // TODO: try to fetch blocks
    toRange = await getChainHeight();

    // TODO: check that bottom range is OK
    // TODO: check if bottom range can overflow spork
    fromRange = toRange - MAX_BLOCK_OFFSET;

    if (fromRange < CURRENT_SPORK_ROOT) {
      console.warn(
        `"from" value of range is lower than current spork root. setting to ${CURRENT_SPORK_ROOT}`
      );
      fromRange = CURRENT_SPORK_ROOT;
    }
  } else {
    toRange = range.to;
    fromRange = range.from;

    if (!range.to) {
      toRange = await getChainHeight();
    }
    if (!range.from) {
      // TODO: check spork overflow
      fromRange = toRange - MAX_BLOCK_OFFSET;
    }
  }

  if (toRange < CURRENT_SPORK_ROOT) {
    console.warn(
      `"to" value of range is lower than current spork root. setting to ${CURRENT_SPORK_ROOT}`
    );
    toRange = CURRENT_SPORK_ROOT;
  }

  if (fromRange < CURRENT_SPORK_ROOT) {
    console.warn(
      `"from" value of range is lower than current spork root. setting to ${CURRENT_SPORK_ROOT}`
    );
    fromRange = CURRENT_SPORK_ROOT;
  }

  return send([getEventsAtBlockHeightRange(getEventName(event), fromRange, toRange)]).then(decode);
};

export const findLatestEvents = async (event, opts = {}) => {
  const {
    step = 200,
    delay = 500,
    start = null,
    maxRange = Infinity,
    sporkLimit = CURRENT_SPORK_ROOT,
  } = opts;
  let currentRange = step;
  let to = start || (await getChainHeight());
  let from = to - step;

  if (to < sporkLimit) {
    console.warn(
      `"to" value of range is lower than current spork root. setting to ${CURRENT_SPORK_ROOT}`
    );
    to = sporkLimit;
  }

  if (from < sporkLimit) {
    console.warn(
      `"from" value of range is lower than current spork root. setting to ${CURRENT_SPORK_ROOT}`
    );
    from = sporkLimit;
  }

  return new Promise((resolve, reject) => {
    let intervalId;

    const findEvents = async function () {
      try {
        console.log(`${from} -> ${to}...`);
        const events = await getEventsInRange(event, { from, to });
        if (events.length !== 0) {
          clearInterval(intervalId);
          resolve({ events });
        } else {
          if (currentRange > maxRange) {
            resolve({ events, latestBlock: to });
          }
          // Continue looking for events
          to = from;
          from -= step;
          currentRange += step;
          setTimeout(findEvents, delay);
        }
      } catch (err) {
        reject({ events: [], err, latestBlock: to });
      }
    };

    setTimeout(findEvents, delay);
  });
};
