import fs from 'fs'
import path from 'path'

export class LaTeXProcessor {
  static async processTemplate(aiSummary) {
    try {
      // Read the base template
      const templatePath = path.join(process.cwd(), 'src', 'templates', 'base-template.tex')
      let templateContent = fs.readFileSync(templatePath, 'utf-8')

      // Replace placeholders with AI-generated content
      const replacements = {
        '{{DOCUMENT_TITLE}}': aiSummary.documentTitle,
        '{{DOCUMENT_SUBTITLE}}': aiSummary.documentSubtitle,
        '{{AUTHOR_NAME}}': aiSummary.authorName,
        '{{INSTITUTION}}': aiSummary.institution,
        '{{DATE}}': aiSummary.date,
        '{{EXECUTIVE_SUMMARY}}': aiSummary.executiveSummary,
        '{{INTRODUCTION}}': aiSummary.introduction,
        '{{MAIN_CONTENT}}': aiSummary.mainContent,
        '{{ANALYSIS}}': aiSummary.analysis,
        '{{RECOMMENDATIONS}}': aiSummary.recommendations,
        '{{CONCLUSION}}': aiSummary.conclusion
      }

      // Perform replacements
      for (const [placeholder, content] of Object.entries(replacements)) {
        templateContent = templateContent.replace(new RegExp(placeholder, 'g'), content || '')
      }

      return templateContent
    } catch (error) {
      console.error('Error processing LaTeX template:', error)
      throw error
    }
  }

  static extractTemplateStructure(pdfText) {
    // Dummy implementation - in reality, you'd parse PDF to extract template structure
    // This could involve analyzing headings, sections, formatting, etc.
    
    const structure = {
      hasTitle: pdfText.toLowerCase().includes('title') || pdfText.toLowerCase().includes('judul'),
      hasSections: pdfText.match(/\d+\./g)?.length > 3,
      hasTableOfContents: pdfText.toLowerCase().includes('contents') || pdfText.toLowerCase().includes('daftar isi'),
      hasExecutiveSummary: pdfText.toLowerCase().includes('executive') || pdfText.toLowerCase().includes('ringkasan'),
      estimatedSections: Math.max(5, pdfText.match(/\d+\./g)?.length || 5)
    }

    console.log('Extracted template structure:', structure)
    
    return structure
  }

  static sanitizeLatexContent(text) {
    if (!text) return ''
    
    // Escape special LaTeX characters
    const latexEscapes = {
      '\\': '\\textbackslash{}',
      '{': '\\{',
      '}': '\\}',
      ':': '\\:',
      '&': '\\&',
      '%': '\\%',
      '#': '\\#',
      '^': '\\textasciicircum{}',
      '_': '\\_',
      '~': '\\textasciitilde{}'
    }

    let sanitized = text
    for (const [char, escape] of Object.entries(latexEscapes)) {
      sanitized = sanitized.replace(new RegExp('\\' + char, 'g'), escape)
    }

    return sanitized
  }

  static convertToLatexFormat(plainText) {
    if (!plainText) return ''
    
    // Convert common formatting
    let formatted = plainText
    
    // Convert bullet points
    formatted = formatted.replace(/^\s*[\-\*\+]\s+(.+)$/gm, '\\item $1')
    
    // Convert numbered lists
    formatted = formatted.replace(/^\s*\d+\.\s+(.+)$/gm, '\\item $1')
    
    // Wrap itemized lists
    formatted = formatted.replace(/(\\item[^\n]*\n)+/g, (match) => {
      return '\\begin{itemize}\n' + match + '\\end{itemize}\n'
    })
    
    // Convert bold text (simple **text** format)
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}')
    
    // Convert italic text (simple *text* format)
    formatted = formatted.replace(/\*(.+?)\*/g, '\\textit{$1}')
    
    return this.sanitizeLatexContent(formatted)
  }
}