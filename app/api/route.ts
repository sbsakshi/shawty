
import { NextResponse } from 'next/server';
import { Database } from '@sqlitecloud/drivers';

import db from '../../lib/db';


export async function GET() {

  try {
    const tables = await db.sql(
      "SELECT name FROM sqlite_master;"
    );

    return NextResponse.json({ 
      status: 'Connected', 
      tables_found: tables 
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'Connection Failed', 
      error: error.message 
    }, { status: 500 });
  }
}