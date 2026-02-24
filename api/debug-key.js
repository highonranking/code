export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    if (!privateKey) {
      return res.json({ error: 'FIREBASE_PRIVATE_KEY is missing' });
    }

    // Check the format
    const hasEscapedNewlines = privateKey.includes('\\n');
    const hasRealNewlines = privateKey.includes('\n');
    
    // Try to parse as JSON (service account keys are JSON)
    const withNewlines = privateKey.replace(/\\n/g, '\n');
    
    console.log('=== PRIVATE KEY DEBUG ===');
    console.log('Length:', privateKey.length);
    console.log('Has \\\\n:', hasEscapedNewlines);
    console.log('Has actual newlines:', hasRealNewlines);
    console.log('First 100 chars:', privateKey.substring(0, 100));
    console.log('After newline replacement (first 100):', withNewlines.substring(0, 100));
    console.log('Starts with -----BEGIN:', withNewlines.includes('-----BEGIN'));
    console.log('Ends with -----END:', withNewlines.includes('-----END'));

    // Check if it looks like a valid PEM key
    const lines = withNewlines.split('\n');
    console.log('Number of lines:', lines.length);
    console.log('First line:', lines[0]);
    console.log('Last line:', lines[lines.length - 1]);

    return res.json({
      debug: {
        length: privateKey.length,
        hasEscapedNewlines,
        hasRealNewlines,
        lineCount: lines.length,
        startsCorrectly: withNewlines.startsWith('-----BEGIN'),
        endsCorrectly: withNewlines.endsWith('-----END'),
      },
      status: 'Key format looks valid' + (withNewlines.startsWith('-----BEGIN') && withNewlines.includes('-----END') ? ' ✓' : ' ✗'),
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
