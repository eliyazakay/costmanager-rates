from fpdf import FPDF
import os

BASE   = r'c:\Users\eliya\OneDrive\מסמכים\Third year\Semester B\Front-end Dev\CostManager'
OUTPUT = os.path.join(BASE, 'eliya_zakay.pdf')

# ── helpers ───────────────────────────────────────────────────────────────────

def safe(s):
    """Drop characters that Courier/Helvetica (Latin-1) cannot encode."""
    out = []
    for ch in s:
        try:
            ch.encode('latin-1')
            out.append(ch)
        except (UnicodeEncodeError, UnicodeDecodeError):
            out.append('?')
    return ''.join(out)

def read_file(path):
    try:
        with open(path, encoding='utf-8', errors='replace') as f:
            return f.readlines()
    except FileNotFoundError:
        return None

# ── PDF class ─────────────────────────────────────────────────────────────────

class PDF(FPDF):
    def footer(self):
        self.set_y(-13)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')
        self.set_text_color(0, 0, 0)

pdf = PDF(orientation='L', format='A4')   # landscape => ~267 mm usable width
pdf.set_auto_page_break(auto=True, margin=18)
pdf.set_margins(15, 15, 15)

# ── COVER / TEAM INFO ─────────────────────────────────────────────────────────

pdf.add_page()

# main title
pdf.set_font('Helvetica', 'B', 22)
pdf.set_text_color(20, 60, 150)
pdf.cell(0, 14, 'Cost Manager  |  Final Project Submission', ln=True, align='C')
pdf.ln(2)

# blue rule
pdf.set_draw_color(20, 60, 150)
pdf.set_line_width(0.7)
pdf.line(15, pdf.get_y(), pdf.w - 15, pdf.get_y())
pdf.ln(8)

def section_title(text):
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(20, 60, 150)
    pdf.cell(0, 9, text, ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(1)

def body(text, bold=False):
    style = 'B' if bold else ''
    pdf.set_font('Helvetica', style, 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 7, text, ln=True)

def indent_body(text):
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(8, 7, '', ln=False)
    pdf.cell(0, 7, text, ln=True)

section_title('--- TEAM INFO ---')
body('Team Manager:  Eliya Zakay', bold=True)
pdf.ln(3)
body('Team Members:', bold=True)
indent_body('1.  Polina Katsnelson  |  ID: 342854940  |  Phone: 0587514036  |  Email: katsnelsonp@gmail.com')
indent_body('2.  Sam Sotil          |  ID: 207970807  |  Phone: 0544500290  |  Email: sotilsam@gmail.com')
indent_body('3.  Eliya Zakay        |  ID: 323094847  |  Phone: 0545874150  |  Email: eliyazak3@gmail.com')
pdf.ln(4)

pdf.set_font('Helvetica', 'B', 11)
pdf.set_text_color(0, 0, 0)
pdf.cell(35, 7, 'Video Link:', ln=False)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0, 0, 200)
pdf.cell(0, 7, 'https://youtu.be/3IVD6tUVs6Y', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.ln(4)

body('Collaborative Tools Used:', bold=True)
pdf.set_font('Helvetica', '', 11)
pdf.multi_cell(0, 7, 'We used GitHub for version control and task management,\nand WhatsApp for team communication and coordination.')
pdf.ln(8)

pdf.set_line_width(0.7)
pdf.line(15, pdf.get_y(), pdf.w - 15, pdf.get_y())
pdf.ln(8)

section_title('--- CODE FILES ---')
pdf.set_font('Helvetica', '', 11)
pdf.multi_cell(0, 7, 'The following pages contain all source code files for the project.')

# ── CODE FILES ────────────────────────────────────────────────────────────────

FILES = [
    ('src/App.jsx',                       os.path.join(BASE, 'src', 'App.jsx')),
    ('src/App.css',                       os.path.join(BASE, 'src', 'App.css')),
    ('src/index.css',                     os.path.join(BASE, 'src', 'index.css')),
    ('src/main.jsx',                      os.path.join(BASE, 'src', 'main.jsx')),
    ('src/db.js',                         os.path.join(BASE, 'src', 'db.js')),
    ('db.js  (root - vanilla version)',   os.path.join(BASE, 'db.js')),
    ('index.html',                        os.path.join(BASE, 'index.html')),
    ('vite.config.js',                    os.path.join(BASE, 'vite.config.js')),
    ('package.json',                      os.path.join(BASE, 'package.json')),
    ('rates.json',                        os.path.join(BASE, 'rates.json')),
    ('src/components/NavBar.jsx',         os.path.join(BASE, 'src', 'components', 'NavBar.jsx')),
    ('src/components/AddCostForm.jsx',    os.path.join(BASE, 'src', 'components', 'AddCostForm.jsx')),
    ('src/components/MonthlyReport.jsx',  os.path.join(BASE, 'src', 'components', 'MonthlyReport.jsx')),
    ('src/components/BarChartView.jsx',   os.path.join(BASE, 'src', 'components', 'BarChartView.jsx')),
    ('src/components/PieChartView.jsx',   os.path.join(BASE, 'src', 'components', 'PieChartView.jsx')),
    ('src/components/Settings.jsx',       os.path.join(BASE, 'src', 'components', 'Settings.jsx')),
]

CODE_SIZE   = 8
LINE_H      = 4.5
NUM_W       = 10         # mm reserved for line-number column

for label, filepath in FILES:
    pdf.add_page()

    # ── file header bar
    pdf.set_fill_color(220, 232, 255)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(15, 50, 130)
    pdf.cell(0, 10, safe(label), ln=True, fill=True)
    pdf.ln(2)

    lines = read_file(filepath)
    if lines is None:
        pdf.set_font('Helvetica', 'I', 10)
        pdf.set_text_color(200, 0, 0)
        pdf.cell(0, 8, f'File not found: {filepath}', ln=True)
        continue

    pdf.set_font('Courier', '', CODE_SIZE)

    for i, raw_line in enumerate(lines, start=1):
        line = raw_line.rstrip('\n\r').replace('\t', '    ')
        line = safe(line)

        # alternate row shading
        if i % 2 == 0:
            pdf.set_fill_color(245, 248, 255)
        else:
            pdf.set_fill_color(255, 255, 255)

        # line-number column (gray)
        pdf.set_text_color(160, 160, 160)
        pdf.cell(NUM_W, LINE_H, f'{i:4d} ', ln=False, fill=True)

        # code column (dark)
        pdf.set_text_color(25, 25, 25)
        # Use cell with w=0 so it spans to right margin; no auto-wrap
        pdf.cell(0, LINE_H, line, ln=True, fill=True)

# ── save ─────────────────────────────────────────────────────────────────────

pdf.output(OUTPUT)
print(f'\nDone!  PDF saved to:\n  {OUTPUT}')
