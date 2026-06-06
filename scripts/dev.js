import { spawn } from 'node:child_process';
import net from 'node:net';

const children = [];

const getNpmRunCommand = (script) => {
  if (process.platform !== 'win32') {
    return {
      command: 'npm',
      args: ['run', script],
    };
  }

  return {
    command: process.env.ComSpec || 'cmd.exe',
    args: ['/d', '/s', '/c', `npm run ${script}`],
  };
};

const isPortOpenOnHost = (port, host) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });

const isPortOpen = async (port, hosts = ['127.0.0.1', '::1']) => {
  const hostList = Array.isArray(hosts) ? hosts : [hosts];
  const results = await Promise.all(
    hostList.map((host) => isPortOpenOnHost(port, host))
  );

  return results.some(Boolean);
};

const waitForPort = async (port, label, timeoutMs = 20000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isPortOpen(port)) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.warn(`${label} did not open port ${port} within ${timeoutMs}ms.`);
  return false;
};

const runScript = (name, script) => {
  console.log(`Starting ${name}: npm run ${script}`);
  const { command, args } = getNpmRunCommand(script);
  const child = spawn(command, args, {
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  children.push(child);
  child.stdout?.on('data', (chunk) => process.stdout.write(chunk));
  child.stderr?.on('data', (chunk) => process.stderr.write(chunk));
  child.on('error', (error) => {
    console.error(`${name} failed to start: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`${name} stopped by ${signal}.`);
      return;
    }

    if (code !== 0) {
      console.warn(`${name} exited with code ${code}.`);
    }
  });

  return child;
};

const stopChild = (child) => {
  if (child.killed || child.exitCode !== null || !child.pid) return;

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    return;
  }

  child.kill('SIGTERM');
};

const shutdown = () => {
  for (const child of children) {
    stopChild(child);
  }
};

process.once('SIGINT', () => {
  shutdown();
  process.exit(0);
});

process.once('SIGTERM', () => {
  shutdown();
  process.exit(0);
});

if (await isPortOpen(27017)) {
  console.log('MongoDB already running on port 27017.');
} else {
  runScript('MongoDB', 'dev:db');
  if (!(await waitForPort(27017, 'MongoDB'))) {
    shutdown();
    process.exit(1);
  }
}

if (await isPortOpen(5000)) {
  console.log('Backend already running on port 5000.');
} else {
  runScript('backend', 'dev:backend');
  if (!(await waitForPort(5000, 'Backend'))) {
    shutdown();
    process.exit(1);
  }
}

if (await isPortOpen(5173)) {
  console.log('Frontend already running on port 5173.');
} else {
  runScript('frontend', 'dev:frontend');
}
