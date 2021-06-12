#!/usr/bin/env python3
import subprocess
import sys
import argparse
import configparser
from pathlib import Path


def _parse_args(args):
    p = argparse.ArgumentParser()
    p.add_argument("type", choices=("major", "minor", "patch"), default="minor", help="Which type of semver release is this?")

    return p.parse_args(args)


def _read_version():
    c = configparser.ConfigParser(interpolation=None)
    c.read(Path(".bumpversion.cfg"))
    return c['bumpversion']['current_version']


def release(release_type):
    subprocess.check_call(["npx", "web-ext", "lint"])
    subprocess.check_call(["bumpversion", release_type])
    subprocess.check_call(["npx", "web-ext", "build"])
    new_version = _read_version()
    path_to_output = Path("web-ext-artifacts") / f"keyn-{new_version}.zip"
    
    if not path_to_output.exists():
        sys.exit("Version was bumped in git but new build artefact not found")
    
    subprocess.check_call(["git", "push", "--tags"])
    print(f"""*** MANUAL STEP REQUIRED: ***
    
    You must now upload the release artifact to the Firefox and Chrome extension stores from:
    {str(path_to_output)}

    Firefox: https://addons.mozilla.org/en-GB/developers/addon/keyn/versions/submit/
    Chrome: https://chrome.google.com/webstore/devconsole/e2d397ec-7744-487c-ae47-1a99ead76dbc/hadckfabmbpghnjbnfollclmdmokeohc/edit/package
    """)


def release_cmd(args=None):
    args = args if args is not None else sys.argv[1:]
    args = _parse_args(args)
    release(args.type)



if __name__ == "__main__":
    release_cmd(args=sys.argv[1:])