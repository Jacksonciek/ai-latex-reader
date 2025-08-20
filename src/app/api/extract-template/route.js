import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import { LaTeXProcessor } from '../../lib/latex-processor'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('template')

    if (!file) {
      return NextResponse.json({ error: 'No template file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract text from PDF
    const pdfData = await pdf(buffer)
    const templateText = pdfData.text

    // Process template structure
    const templateStructure = LaTeXProcessor.extractTemplateStructure(templateText)

    // Store template info (in a real app, you might save this to a database)
    // For now, we'll just return success
    console.log('Template processed:', {
      fileName: file.name,
      textLength: templateText.length,
      structure: templateStructure
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Template processed successfully',
      structure: templateStructure 
    })

  } catch (error) {
    console.error('Template processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process template' }, 
      { status: 500 }
    )
  }
}