import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class PDFGenerator {
  static async generateFromLatex(latexContent) {
    const tempDir = path.join(process.cwd(), 'temp')
    const fileName = `report_${Date.now()}`
    const texFile = path.join(tempDir, `${fileName}.tex`)
    const pdfFile = path.join(tempDir, `${fileName}.pdf`)

    try {
      // Create temp directory if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }

      // Write LaTeX content to file
      fs.writeFileSync(texFile, latexContent, 'utf-8')

      // Try to compile with pdflatex (requires LaTeX installation)
      try {
        await execAsync(`pdflatex -output-directory="${tempDir}" "${texFile}"`, {
          timeout: 30000 // 30 second timeout
        })

        // Check if PDF was generated
        if (fs.existsSync(pdfFile)) {
          const pdfBuffer = fs.readFileSync(pdfFile)
          
          // Cleanup temp files
          this.cleanupTempFiles(tempDir, fileName)
          
          return pdfBuffer
        }
      } catch (pdflatexError) {
        console.warn('pdflatex not available, falling back to HTML-to-PDF conversion')
      }

      // Fallback: Convert LaTeX to HTML then to PDF
      return await this.latexToHtmlToPdf(latexContent)

    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error('Failed to generate PDF')
    }
  }

  static async latexToHtmlToPdf(latexContent) {
    // Convert LaTeX to HTML (simplified conversion)
    const htmlContent = this.convertLatexToHtml(latexContent)
    
    // Use html-pdf-node to generate PDF
    const htmlPdf = require('html-pdf-node')
    
    const options = {
      format: 'A4',
      border: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    }

    const file = { content: htmlContent }
    
    try {
      const pdfBuffer = await htmlPdf.generatePdf(file, options)
      return pdfBuffer
    } catch (error) {
      console.error('HTML to PDF conversion error:', error)
      throw new Error('Failed to convert HTML to PDF')
    }
  }

  static convertLatexToHtml(latexContent) {
    // Simplified LaTeX to HTML conversion
    let html = latexContent

    // Document structure
    html = html.replace(/\\documentclass\[.*?\]\{.*?\}/, '')
    html = html.replace(/\\usepackage(\[.*?\])?\{.*?\}/g, '')
    html = html.replace(/\\begin\{document\}/, '<div class="document">')
    html = html.replace(/\\end\{document\}/, '</div>')

    // Title page
    html = html.replace(/\\begin\{titlepage\}(.*?)\\end\{titlepage\}/s, '<div class="titlepage">$1</div>')
    
    // Sections
    html = html.replace(/\\section\{(.*?)\}/g, '<h2>$1</h2>')
    html = html.replace(/\\subsection\{(.*?)\}/g, '<h3>$1</h3>')
    html = html.replace(/\\subsubsection\{(.*?)\}/g, '<h4>$1</h4>')

    // Text formatting
    html = html.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>')
    html = html.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>')
    html = html.replace(/\\texttt\{(.*?)\}/g, '<code>$1</code>')

    // Lists
    html = html.replace(/\\begin\{itemize\}(.*?)\\end\{itemize\}/gs, '<ul>$1</ul>')
    html = html.replace(/\\begin\{enumerate\}(.*?)\\end\{enumerate\}/gs, '<ol>$1</ol>')
    html = html.replace(/\\item\s/g, '<li>')
    html = html.replace(/<li>(.*?)(?=<li>|<\/[uo]l>)/gs, '<li>$1</li>')

    // Table of contents
    html = html.replace(/\\tableofcontents/, '<div class="toc"><h2>Daftar Isi</h2><p>Table of contents would be generated here</p></div>')

    // Page breaks
    html = html.replace(/\\newpage/g, '<div style="page-break-before: always;"></div>')

    // Center alignment
    html = html.replace(/\\centering/g, '<div style="text-align: center;">')

    // Font sizes (LaTeX commands)
    html = html.replace(/\\Huge\{(.*?)\}/g, '<span style="font-size: 2.5em;">$1</span>')
    html = html.replace(/\\huge\{(.*?)\}/g, '<span style="font-size: 2em;">$1</span>')
    html = html.replace(/\\LARGE\{(.*?)\}/g, '<span style="font-size: 1.7em;">$1</span>')
    html = html.replace(/\\Large\{(.*?)\}/g, '<span style="font-size: 1.4em;">$1</span>')
    html = html.replace(/\\large\{(.*?)\}/g, '<span style="font-size: 1.2em;">$1</span>')

    // Clean up remaining LaTeX commands
    html = html.replace(/\\[a-zA-Z]+(\[.*?\])?(\{.*?\})?/g, '')
    html = html.replace(/\{|\}/g, '')

    // Wrap in HTML document
    const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Generated Report</title>
        <style>
            body {
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .document {
                max-width: 800px;
                margin: 0 auto;
            }
            .titlepage {
                text-align: center;
                padding: 50px 0;
                page-break-after: always;
            }
            .titlepage span[style*="font-size: 2.5em"] {
                display: block;
                margin: 20px 0;
                font-weight: bold;
            }
            .titlepage span[style*="font-size: 1.4em"] {
                display: block;
                margin: 10px 0;
            }
            .toc {
                page-break-after: always;
                padding: 20px 0;
            }
            h2 {
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 5px;
                margin-top: 30px;
            }
            h3 {
                color: #34495e;
                margin-top: 25px;
            }
            h4 {
                color: #7f8c8d;
                margin-top: 20px;
            }
            ul, ol {
                margin: 15px 0;
                padding-left: 30px;
            }
            li {
                margin: 5px 0;
            }
            p {
                margin: 15px 0;
                text-align: justify;
            }
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        ${html}
    </body>
    </html>
    `

    return fullHtml
  }

  static cleanupTempFiles(tempDir, fileName) {
    try {
      const extensions = ['.tex', '.pdf', '.aux', '.log', '.out', '.toc']
      extensions.forEach(ext => {
        const file = path.join(tempDir, fileName + ext)
        if (fs.existsSync(file)) {
          fs.unlinkSync(file)
        }
      })
    } catch (error) {
      console.warn('Error cleaning up temp files:', error)
    }
  }
}