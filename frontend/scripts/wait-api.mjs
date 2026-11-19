const url = process.env.E2E_API_URL || 'http://localhost:8080';
for (let attempt=0;attempt<120;attempt++) {
  try {
    const response=await fetch(`${url}/api/v1/health`,{signal:AbortSignal.timeout(2000)});
    if(response.ok) process.exit(0);
  } catch {}
  await new Promise(resolve=>setTimeout(resolve,500));
}
console.error(`Backend is not ready at ${url}`);
process.exit(1);
