# remove debug artifacts
rm -rf build/Release/obj
rm -f build/Release/canvas.exp
rm -f build/Release/canvas.iobj
rm -f build/Release/canvas.ipdb
rm -f build/Release/canvas.lib
rm -f build/Release/canvas.pdb

# Recursively find and copy all UCRT64 DLL dependencies.
# Uses objdump (binutils) to read PE import tables. Loops until
# no new DLLs are discovered (handles transitive dependencies).

copy_deps() {
  local new_found=0
  for pe in build/Release/canvas.node build/Release/*.dll; do
    [ -f "$pe" ] || continue
    local imports
    imports=$(objdump -p "$pe" 2>/dev/null \
      | grep "DLL Name:" \
      | awk '{print $3}' \
      | sort -u)
    for dll_name in $imports; do
      # Skip if already in build/Release (case-insensitive)
      if find build/Release -maxdepth 1 -iname "$dll_name" -print -quit 2>/dev/null | grep -q .; then
        continue
      fi
      # Copy from ucrt64 if available
      local src
      src=$(find /ucrt64/bin -maxdepth 1 -iname "$dll_name" -print -quit 2>/dev/null)
      if [ -n "$src" ]; then
        cp "$src" build/Release/
        new_found=1
      fi
    done
  done
  return $new_found
}

# Keep looping until no new DLLs are found
while copy_deps; do
  :
done

echo "Bundled DLLs:"
ls build/Release/*.dll 2>/dev/null | wc -l
