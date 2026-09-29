export function printCurriculumSheet(plan) {
  if (!plan) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const weeksHtml = plan.weeks
    ?.map(
      (week) => `
    <div style="margin-bottom: 24px; page-break-inside: avoid;">
      <h3 style="font-size: 16px; margin-bottom: 8px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;">
        ${week.title}
      </h3>
      ${week.sessions
        ?.map(
          (session) => `
        <div style="margin-bottom: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
          <h4 style="font-size: 14px; margin: 0 0 8px 0; color: #2563eb; text-transform: uppercase;">
            ${session.name}
          </h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="text-align: left; background: #e2e8f0;">
                <th style="padding: 6px 8px; border-radius: 4px 0 0 4px;">Phase</th>
                <th style="padding: 6px 8px;">Focus / Notes</th>
                <th style="padding: 6px 8px; text-align: right; border-radius: 0 4px 4px 0;">Time</th>
              </tr>
            </thead>
            <tbody>
              ${session.phases
                ?.map(
                  (phase) => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 6px 8px; font-weight: 600; color: #0f172a;">${phase.name}</td>
                  <td style="padding: 6px 8px; color: #475569;">${phase.notes || '-'}</td>
                  <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: 600; color: #2563eb;">${phase.durationMinutes} min</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `
        )
        .join('')}
    </div>
  `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MatFlow Sheet - ${plan.title}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 32px; color: #0f172a; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 24px; font-weight: bold; margin: 0; }
          .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge { background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 12px; border: 1px solid #bfdbfe; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${plan.title}</h1>
            <div class="meta">${plan.sport} • ${plan.totalWeeks} Weeks • ${plan.level}</div>
            ${plan.description ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #475569;">${plan.description}</p>` : ''}
          </div>
          <span class="badge">MatFlow Clipboard Sheet</span>
        </div>
        ${weeksHtml}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
