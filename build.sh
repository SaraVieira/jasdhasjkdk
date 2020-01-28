mkdir -p build

pandoc \
    --pdf-engine=xelatex \
    --template=./templates/eisvogel.latex \
    --highlight-style tango \
    --toc -N \
    -o build/output.pdf \
    title.txt Book.md
