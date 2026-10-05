$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("d:\faeda-wazayif\Faeda_University_Ecosystem_Complete_Enterprise_Report.docx")
$pages = $doc.ComputeStatistics(2)
$words = $doc.ComputeStatistics(0)
$paragraphs = $doc.ComputeStatistics(4)
$doc.Close()
$word.Quit()
Write-Host "DOCX Statistics:"
Write-Host "Total Pages: $pages"
Write-Host "Total Words: $words"
Write-Host "Total Paragraphs: $paragraphs"
