# Script PowerShell pour réorganiser le fichier kraland-userscript-template.js
# Déplace les définitions de fonctions avant l'IIFE init()

$filePath = "kraland-userscript-template.js"
$content = Get-Content $filePath -Raw

# Trouver la ligne "// Initial bootstrap" qui précède init()
$initMarker = "  // Initial bootstrap"
$initPos = $content.IndexOf($initMarker)

# Extraire le bloc de fonctions après init (ligne 543 à ~ligne 973)
# On cherche la fin de l'IIFE init(): "  })();"
$initEndMarker = "  })();"
$initEndPos = $content.IndexOf($initEndMarker, $initPos) + $initEndMarker.Length

# Le bloc de fonctions commence après init() jusqu'avant la fermeture finale "})()"
$functionsStart = $initEndPos + 1
$finalCloseMarker = "`n})();"
$finalClosePos = $content.LastIndexOf($finalCloseMarker)

# Extraire les trois parties
$before = $content.Substring(0, $initPos)
$initBlock = $content.Substring($initPos, $initEndPos - $initPos)
$functionsBlock = $content.Substring($functionsStart, $finalClosePos - $functionsStart)
$after = $content.Substring($finalClosePos)

# Reconstruire le fichier avec les fonctions AVANT init()
$newContent = $before + $functionsBlock + "`n" + $initBlock + $after

# Sauvegarder
$newContent | Set-Content $filePath -NoNewline

Write-Host "Fichier réorganisé avec succès!"
Write-Host "Les fonctions ont été déplacées avant init()"
