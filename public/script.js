const div = document.createElement('div');

div.style.textAlign = 'center';
div.style.fontFamily = 'sans-serif';
div.innerHTML = `
  <h1>QR Code Generator</h1>
  <p>Escaneie com seu WhatsApp</p>
  <img id="qrcode" alt="QR Code" />
`;

document.body.appendChild(div);

fetch('http://localhost:3001/qrcode')
  .then(res => res.json())
  .then(data => {
    const img = document.getElementById('qrcode');

    // Corrige se o backend estiver mandando só o base64 puro
    if (data.qr && !data.qr.startsWith('data:image')) {
      img.src = `data:image/png;base64,${data.qr}`;
    } else {
      img.src = data.qr;
    }
  })
  .catch(err => {
    console.error('Erro ao buscar QR Code:', err);
  });
