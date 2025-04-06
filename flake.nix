{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    toha = {
      flake = false;
      url = "github:hugo-toha/toha/v4.8.0";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-unstable,
      flake-utils,
      toha,
    }:
    let
      name = "hugo-toha.github.io";
    in
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        pkgs-unstable = nixpkgs-unstable.legacyPackages.${system};

        go = pkgs-unstable.go;
        hugo = pkgs-unstable.hugo;

        website-src = pkgs.nix-gitignore.gitignoreSource [ ] ./.;

        website-descr = {
          inherit name;

          nativeBuildInputs = [
            go
            hugo
          ];

          npmDepsHash = "sha256-/BOgQY41ahnONSJNQL39W2zKrzO7dT/7HRD1mOJ/CQI=";

          src = website-src;

          postPatch =
            let
              before_patch = ''
                // replace(
                //     github.com/hugo-toha/toha/v4 => ../toha
                // )
              '';
              after_patch = ''
                replace(
                    github.com/hugo-toha/toha/v4 => ${toha}
                )
              '';
            in
            ''
              substituteInPlace go.mod --replace-fail "${before_patch}" "${after_patch}"
              find . -type f -name "*.md" | xargs sed -i 's/{{<[[:space:]]*tweet[[:space:][:alnum:]="]*>}}/TWEETS DISABLED BY NIX PATCH/g'
            '';

          buildPhase = ''
            runHook preBuild
            ${hugo}/bin/hugo
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r public/* $out/
            runHook postInstall
          '';
        };

        website = pkgs.buildNpmPackage website-descr;

        website-src-and-deps = pkgs.buildNpmPackage (
          website-descr
          // {
            name = "${website-descr.name}-src-and-deps";

            buildPhase = ''
              runHook preBuild
              runHook postBuild
            '';

            installPhase = ''
              runHook preInstall
              mkdir -p $out
              cp -r ./* $out/
              runHook postInstall
            '';
          }
        );

        hugo-in-build = pkgs.writeShellApplication {
          name = "hugo";
          runtimeInputs =
            [ website-src-and-deps ]
            ++ website.nativeBuildInputs
            ++ (with pkgs; [
              git
              rsync
            ]);
          text = ''
            echo "You are running a wrapper around hugo that updates the content of ./build/ and runs it there."
            mkdir -p build
            # Copy from Nix store because hugo requires some of the files to be editable
            rsync --recursive --copy-links --copy-dirlinks --chmod=777 --delete ${website-src-and-deps}/ build/
            # Hard link some files so that hugo can automatically rebuilt when they change
            find ./*.json ./*.mod ./*.yaml ./archetypes ./assets ./content ./data ./static -print0 | xargs -0 -I file sh -c "test -f file && test -f build/file && cmp --silent file build/file && cp -prfl file build/file || true"
            # shellcheck disable=SC2048,SC2086
            (cd "build/"; hugo $*)
          '';
        };

        hugo-in-build-defaults-to-server = pkgs.writeShellApplication {
          name = "hugo";
          runtimeInputs = [ hugo-in-build ];
          text = ''
            if [ "$#" -ne 0 ]; then
              hugo "$*"
            else
              hugo server
            fi
          '';
        };
      in

      rec {
        packages = {
          "${name}" = website;
          default = website;
        };

        devShells.default = pkgs.mkShell {
          buildInputs = [
            go
            hugo-in-build
          ];
        };

        apps.default = {
          type = "app";
          program = "${hugo-in-build-defaults-to-server}/bin/hugo";
        };
      }
    );
}
