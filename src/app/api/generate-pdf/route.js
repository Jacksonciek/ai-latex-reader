import { NextRequest, NextResponse } from 'next/server'
import { LaTeXProcessor } from '../../lib/latex-processor'
import { PDFGenerator } from '../../lib/pdf-generator'

export async function POST(request) {
  try {
    const { summary } = await request.json()

    if (!summary) {
      return NextResponse.json({ error: 'No summary data provided' }, { status: 400 })
    }

    console.log('Generating LaTeX from AI summary...')

    // Process the AI summary with LaTeX template
    const latexContent = await LaTeXProcessor.processTemplate(summary)
    
    console.log('LaTeX content generated, creating PDF...')

    // Generate PDF from LaTeX
    const pdfBuffer = await PDFGenerator.generateFromLatex(latexContent)

    console.log('PDF generated successfully')

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="generated-report.pdf"',
      },
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message }, 
      { status: 500 }
    )
  }
}