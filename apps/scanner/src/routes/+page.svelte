<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';

	const KEY = import.meta.env.VITE_PERMISSION_KEY;
	let scanner: Html5Qrcode | null = null;
  let lastScannedText = '';
	let isScanning = false;

	function startScanning() {
		if (isScanning) return;

		lastScannedText = '';
		isScanning = true;
		const config = { fps: 10, qrbox: 250 };
		scanner = new Html5Qrcode('reader');

		scanner
			.start(
				{ facingMode: 'environment' },
				config,
				(decodedText, _decodedResult) => {
					lastScannedText = `${decodedText}&key=${KEY}`;
					isScanning = false;
					if (scanner) {
						scanner.stop();
					}
				},

				(errorMessage) => {
					console.warn(`QR Code scan error: ${errorMessage}`);
				}
			)
			.catch((err) => {
				console.error(`Unable to start scanning: ${err}`);
			});
	}

  onMount(() => {
    isScanning = true;
		const config = { fps: 10, qrbox: 250 };
		scanner = new Html5Qrcode('reader');

		scanner
			.start(
				{ facingMode: 'environment' },
				config,
				(decodedText, _decodedResult) => {
					lastScannedText = `${decodedText}&key=${KEY}`;
					isScanning = false;
					if (scanner) {
						scanner.stop();
					}
				},

				(errorMessage) => {
					console.warn(`QR Code scan error: ${errorMessage}`);
				}
			)
			.catch((err) => {
				console.error(`Unable to start scanning: ${err}`);
			});
  });

	onDestroy(() => {
		if (scanner) {
			scanner
				.stop()
				.then(() => {
					console.log('QR Code scanning stopped.');
				})
				.catch((err) => {
					console.error(`Error stopping the scanner: ${err}`);
				});
		}
	});
</script>

{#if lastScannedText}
	<p class="result">Participante Nro: {lastScannedText.slice(lastScannedText.indexOf("id=")+3, lastScannedText.indexOf("id=")+7)}</p>
{/if}
<div id="reader" class="scanner"></div>
{#if lastScannedText}
	<a href={lastScannedText} target="_blank" class="anchor" referrerpolicy="no-referrer"
		>Marcar asistencia</a
	>
	<button on:click={startScanning}>Scan New QR Code</button>
{/if}

<style>
	.anchor {
		color: white;
		text-decoration: none;
		font-size: 1.5rem;
		margin: 0.5rem 0;
		border: 1px solid white;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
	}

	.scanner {
		width: 300px;
		border: 1px solid white;
		margin: 1rem 0;
	}

	.result {
		margin: 1rem 0;
		text-align: center;
	}

	button {
		background-color: white;
		color: #152a55;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}
</style>
