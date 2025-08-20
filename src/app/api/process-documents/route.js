import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import { AIService } from '../../lib/ai-service'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('documents')

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No documents provided' }, { status: 400 })
    }

    console.log(`Processing ${files.length} documents...`)

    // Extract text from all PDF documents
    const documentTexts = []
    
    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const pdfData = await pdf(buffer)
        
        documentTexts.push({
          fileName: file.name,
          text: pdfData.text,
          pageCount: pdfData.numpages
        })

        console.log(`Extracted text from ${file.name}: ${pdfData.text.length} characters`)
      } catch (pdfError) {
        console.error(`Error processing ${file.name}:`, pdfError)
        // Continue with other files even if one fails
      }
    }

    if (documentTexts.length === 0) {
      return NextResponse.json({ error: 'Failed to extract text from any documents' }, { status: 400 })
    }

    // Process documents with AI (using dummy service for now)
    const aiSummary = await AIService.summarizeDocuments(documentTexts.map(doc => doc.text))

    console.log('AI processing completed')

    return NextResponse.json({ 
      success: true, 
      summary: aiSummary,
      processedDocuments: documentTexts.length
    })

  } catch (error) {
    console.error('Document processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process documents' }, 
      { status: 500 }
    )
  }
}