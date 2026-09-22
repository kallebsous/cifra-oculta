import crypto from 'node:crypto';

const RAW_PAYLOAD = "COORD-4471-ÍCARO [LAT: -23.5505, LON: -46.6333, ALT: 420km, AZ: 128.4°]";
const SECRET_KEY = crypto.randomBytes(32); // 256-bit AES key

/**
 * Simula o tráfego do pacote de coordenadas pela rota orbital
 * @param {Object} options
 * @param {string[]} options.equipment - Array com os ids dos equipamentos selecionados ('cofre', 'lista', 'antivirus', 'turbo')
 * @param {string} [options.customPayload] - Texto alternativo opcional
 */
export function simulateDispatch({ equipment = [], customPayload = RAW_PAYLOAD }) {
  const payload = customPayload || RAW_PAYLOAD;
  const hasCofre = equipment.includes('cofre');
  const hasLista = equipment.includes('lista');
  const hasAntivirus = equipment.includes('antivirus');
  const hasTurbo = equipment.includes('turbo');

  // Integridade: cálculo real de hash SHA-256
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex').substring(0, 16);

  let encryptedPayload = null;
  let ivHex = null;
  let authTagHex = null;
  let decryptedText = null;

  if (hasCofre) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', SECRET_KEY, iv);
    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    encryptedPayload = encrypted;
    ivHex = iv.toString('hex');
    authTagHex = authTag.toString('hex');

    // Decifração simulada no destino (Ícaro) com a chave
    try {
      const decipher = crypto.createDecipheriv('aes-256-gcm', SECRET_KEY, iv);
      decipher.setAuthTag(authTag);
      let dec = decipher.update(encrypted, 'hex', 'utf8');
      dec += decipher.final('utf8');
      decryptedText = dec;
    } catch {
      decryptedText = '[FALHA NA DECIFRAÇÃO]';
    }
  }

  // Cálculo da Tríade CIA
  const availability = 100; // O pacote sempre chega
  const integrity = 100;    // Nenhum bit foi alterado
  const confidentiality = hasCofre ? 100 : 0; // Se não tem cofre, o segredo vaza 100%

  // Logs reais de telemetria dos nós
  const nodeLogs = [
    {
      step: 1,
      node: "CONSOLE TERRESTRE",
      status: "DISPATCHED",
      protocol: hasCofre ? "TLS 1.3 / AES-256-GCM" : "RAW / HTTP PLAINTEXT",
      visibleData: hasCofre ? `CIPHERTEXT: ${encryptedPayload?.substring(0, 24)}... (IV: ${ivHex})` : payload,
      notes: hasLista ? "Controle de Acesso: Token de autorização assinado anexado." : "Sem restrição de requisição."
    },
    {
      step: 2,
      node: "ESTAÇÃO RELÉ ALFA",
      status: "FORWARDED",
      protocol: "PACKET INSPECT",
      visibleData: hasCofre ? "[BLOCO ILEGÍVEL DE BYTES]" : payload,
      notes: hasCofre ? "Relé encaminhou sem conseguir ler o miolo." : "Operador do relé leu as coordenadas completas no log de auditoria."
    },
    {
      step: 3,
      node: "AGENTE V (SNIFFER / TAP)",
      status: "INTERCEPTED",
      protocol: "PROMISCUOUS TAP",
      visibleData: hasCofre ? `#&7f!$*0x${encryptedPayload?.substring(0, 16)} [SEM CHAVE PRIVADA]` : payload,
      notes: hasCofre
        ? "Agente V capturou 100% dos bytes, mas sem a chave privada de Ícaro só obteve entropia inútil."
        : "Vazamento total! Agente V copiou coordenadas de lançamento sem deixar vestígios."
    },
    {
      step: 4,
      node: "SATÉLITE ÍCARO",
      status: "RECEIVED",
      protocol: "FINAL DESTINATION",
      visibleData: hasCofre ? `DECIFRADO: ${decryptedText}` : payload,
      integrityCheck: `SHA-256: ${payloadHash} (CONFERE)`,
      notes: "Sinal recebido. " + (hasCofre ? "Chave privada combinada com sucesso." : "Conteúdo recebido em claro.")
    }
  ];

  return {
    success: true,
    timestamp: new Date().toISOString(),
    equipmentUsed: equipment,
    stats: {
      hasCofre,
      hasLista,
      hasAntivirus,
      hasTurbo,
      transitSpeedMs: hasTurbo ? 400 : 1200
    },
    triad: {
      connection: availability,
      data: integrity,
      secret: confidentiality
    },
    payload: {
      original: payload,
      isEncrypted: hasCofre,
      ciphertext: encryptedPayload,
      iv: ivHex,
      authTag: authTagHex,
      hashSha256: payloadHash
    },
    nodeLogs,
    summary: {
      outcome: hasCofre ? "VITÓRIA CIFRADA" : "DERROTA SILENCIOSA",
      verdict: hasCofre
        ? "Confidencialidade mantida: o pacote foi capturado, mas a mensagem permaneceu secreta."
        : "Falha de Confidencialidade: a entrega funcionou, mas o segredo vazou para todos os nós intermediários."
    }
  };
}
