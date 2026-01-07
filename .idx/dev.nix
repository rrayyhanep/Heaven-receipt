
{ pkgs, ... }: {
  # Nix channel to use.
  channel = "stable-24.05";

  # Packages to install.
  packages = [
    pkgs.nodejs_20
  ];

  # VS Code extensions to install.
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
    ];

    # Workspace lifecycle hooks.
    workspace = {
      # Runs when a workspace is first created.
      onCreate = {
        npm-install = "npm install";
      };
      # Runs every time the workspace is (re)started.
      onStart = {
        dev-server = "npm run dev";
      };
    };

    # Web preview configuration.
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
