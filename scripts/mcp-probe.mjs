import path from 'node:path';
import { pathToFileURL } from 'node:url';

const entrypoint = process.argv[2] || process.env.SEQUENTIAL_THINKING_ENTRYPOINT;
const nodeExecutable = process.argv[3] || process.env.SEQUENTIAL_THINKING_NODE;
const timeoutMs = Number(process.argv[4] || 12000);

if (!entrypoint || !nodeExecutable) {
  console.error('USAGE: node mcp-probe.mjs <entrypoint> <nodeExecutable> [timeoutMs]');
  process.exit(2);
}

const serverRoot = path.resolve(entrypoint, '..', '..');
const sdkRoot = path.resolve(serverRoot, 'node_modules', '@modelcontextprotocol', 'sdk');
const clientIndex = pathToFileURL(path.join(sdkRoot, 'dist/esm/client/index.js')).href;
const clientStdio = pathToFileURL(path.join(sdkRoot, 'dist/esm/client/stdio.js')).href;

const importWithFallback = async (modulePath) => {
  try {
    return await import(modulePath);
  } catch (error) {
    throw new Error(`Failed to import SDK module: ${modulePath}. ${error.message}`);
  }
};

const clientPromise = importWithFallback(clientIndex);
const transportPromise = importWithFallback(clientStdio);

const fail = (error) => {
  console.error(JSON.stringify({
    status: 'error',
    stage: 'probe-failure',
    error,
  }, null, 2));
  process.exit(1);
};

const timeout = setTimeout(() => {
  fail(`Probe timeout after ${timeoutMs}ms`);
}, timeoutMs);

const normalizePath = (value) => {
  return value.replace('\\', '/');
};

const runProbe = async () => {
  try {
    const { Client } = await clientPromise;
    const { StdioClientTransport } = await transportPromise;

    const transport = new StdioClientTransport({
      command: normalizePath(nodeExecutable),
      args: [normalizePath(entrypoint)],
      stderr: 'pipe',
    });

    const client = new Client(
      {
        name: 'local-maintenance-probe',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);

    const toolList = await client.listTools();
    await client.close();
    clearTimeout(timeout);

    const tools = (toolList && toolList.tools) || [];
    const hasSequential = tools.some((tool) => tool && tool.name === 'sequentialthinking');
    const payload = {
      status: hasSequential ? 'ok' : 'missing-tool',
      totalTools: tools.length,
      hasSequentialThinking: hasSequential,
      availableTools: tools
        .filter((tool) => tool && tool.name)
        .map((tool) => ({ name: tool.name, description: tool.description || '' })),
      transport: {
        nodeExecutable: normalizePath(nodeExecutable),
        entrypoint: normalizePath(entrypoint),
      },
    };

    if (!hasSequential) {
      console.error(JSON.stringify(payload, null, 2));
      process.exit(2);
    }

    console.log(JSON.stringify(payload, null, 2));
    process.exit(0);
  } catch (error) {
    fail(error.message);
  }
};

runProbe();
