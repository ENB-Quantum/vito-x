import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import { IncomingMessage } from 'http';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Maximum file size: 10MB (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Disable the built-in Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data using formidable
const parseForm = async (req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    // Convert NextRequest to IncomingMessage-like object
    const form = formidable({ 
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true 
    });
    
    // We need to adapt the NextRequest to work with formidable
    // This is a simplification - you might need to adjust based on your exact Next.js version
    const reqAdapter = {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: req.url,
      on: (event: string) => {
        if (event === 'data' || event === 'end') {
          // Handle streaming data
        }
      }
    } as unknown as IncomingMessage;
    
    form.parse(reqAdapter, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data using formidable
    const { files } = await parseForm(request);
    const file = files.file?.[0]; // In newer formidable versions
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const fileType = file.mimetype || '';
    const validTypes = [
      'audio/mpeg',        // MP3
      'audio/mp4',         // MP4 audio
      'audio/wav',         // WAV
      'audio/x-wav',       // WAV (alternative MIME type)
      'audio/ogg',         // OGG
      'audio/flac',        // FLAC
      'audio/aac',         // AAC
      'audio/webm',        // WebM audio
      'audio/x-m4a',       // M4A
      'audio/x-aiff',      // AIFF
      'audio/x-ms-wma'     // WMA
    ];
    
    if (!validTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a supported audio file.' },
        { status: 400 }
      );
    }

    // Generate a unique file path
    const userId = session.user.email || 'unknown';
    const fileName = `${userId}/${uuidv4()}-${file.originalFilename}`;
    
    // Read file from temp location
    const fileBuffer = await fs.readFile(file.filepath);
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('voice-uploads')
      .upload(fileName, fileBuffer, {
        contentType: fileType,
        cacheControl: '3600'
      });
      
    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('voice-uploads')
      .getPublicUrl(fileName);
      
    // Record the upload in the database
    const { error: dbError } = await supabase
      .from('uploads')
      .insert({
        user_id: userId,
        file_name: file.originalFilename,
        file_path: fileName,
        file_type: 'audio',
        file_size: file.size,
        public_url: urlData.publicUrl
      });
      
    if (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB recording fails
    }
    
    return NextResponse.json({
      success: true,
      fileName: file.originalFilename,
      fileSize: file.size,
      url: urlData.publicUrl
    });
    
  } catch (error) {
    console.error('Audio upload error:', error);
    return NextResponse.json(
      { error: 'Server error while processing upload' },
      { status: 500 }
    );
  }
}