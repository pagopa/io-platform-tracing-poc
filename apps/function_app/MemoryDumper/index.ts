import { getConfigOrThrow } from "../utils/config";
import { getHeapWriter } from "../utils/heap";
import { memoryDumperHandler } from "./handler";

const config = getConfigOrThrow();

const updateExpiredCgnHandler = memoryDumperHandler(
  getHeapWriter(
    config.HEAP_DUMP_STORAGE_CONN_STRING,
    config.HEAP_CONTAINER_NAME
  ),
  config.HEAP_LIMIT_PERCENTAGE,
  config.WEBSITE_DEPLOYMENT_ID
);

export default updateExpiredCgnHandler;
