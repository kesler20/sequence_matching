from setuptools import setup, find_packages
from typing import List
import typing
import subprocess

def get_current_version() -> typing.Optional[str]:
    try:
        # Get the latest tag reference
        latest_tag_ref = (
            subprocess.check_output(
                ["git", "rev-list", "--tags", "--max-count=1"], stderr=subprocess.STDOUT
            )
            .decode()
            .strip()
        )

        # Get the tag name based on the reference
        version = (
            subprocess.check_output(
                ["git", "describe", "--tags", latest_tag_ref], stderr=subprocess.STDOUT
            )
            .decode()
            .strip()
        )

        return version
    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e.output.decode().strip()}")
        return None


__version__ = get_current_version() or "v0.0.1"
def filter_requirements(requirements: List[str]):
    return list(
        filter(
            lambda line: not line.startswith("certifi")
            and not line.startswith("wincertstore"),
            requirements,
        )
    )


with open("README.md", "r", encoding="utf-8") as readme_file, open(
    "requirements.txt", "r"
) as requirements_file:
    long_description = readme_file.read()
    requirements = filter_requirements(
        [line.replace("\n", "") for line in requirements_file.readlines()]
    )

if __name__ == "__main__":
    setup(
        name="wiz_app_backend",
        version=__version__,
        description="A template for making python applications",
        long_description_content_type="text/markdown",
        long_description=long_description,
        package_dir={"": "src"},
        author="Kesler Isoko",
        author_email="uchekesla@gmail.com",
        packages=find_packages(where="src", exclude=("tests*")),
        install_requires=requirements,
        classifiers=[
            "Programming Language :: Python :: 3",
            "Operating System :: OS Independent",
        ]
    )
