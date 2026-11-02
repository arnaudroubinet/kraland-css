"""Réduit les captures de la galerie en PNG à palette (256 couleurs, sans tramage) : environ 2,5 fois plus légères, texte intact.

Appelé par capturer.mjs à la fin d'une génération (si Python 3 et Pillow sont présents), ou à la main :
    python3 snapshot/compresser.py snapshot/kraland/2-mobile/01-accueil.png ...
    python3 snapshot/compresser.py --tout
"""
import pathlib
import sys

from PIL import Image

ICI = pathlib.Path(__file__).resolve().parent


def compresser(chemin):
    image = Image.open(chemin)
    if image.mode == 'P':
        return
    image = image.convert('RGB').quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    image.save(chemin, optimize=True)


def main():
    fichiers = sorted(ICI.glob('*/*/*.png')) if sys.argv[1:] == ['--tout'] else [pathlib.Path(a) for a in sys.argv[1:]]
    for f in fichiers:
        compresser(f)
    print(f'{len(fichiers)} capture(s) compressée(s).')


if __name__ == '__main__':
    main()
