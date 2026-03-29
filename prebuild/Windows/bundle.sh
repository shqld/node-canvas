# remove debug artifacts
rm -rf build/Release/obj
rm -f build/Release/canvas.exp
rm -f build/Release/canvas.iobj
rm -f build/Release/canvas.ipdb
rm -f build/Release/canvas.lib
rm -f build/Release/canvas.pdb

# Copy all DLLs from ucrt64/bin that our linked libraries need.
# Rather than trying to resolve the dependency tree dynamically
# (objdump doesn't work on MSVC binaries, depends.exe site is unreliable,
# ldd may fail on mixed MSVC/UCRT64 binaries), just copy all DLLs from
# the packages we installed in preinstall.sh.
cp /ucrt64/bin/*.dll build/Release/

echo "Bundled DLLs: $(ls build/Release/*.dll | wc -l)"
