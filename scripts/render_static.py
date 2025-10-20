"""Render Jinja templates into static HTML files.

This utility allows the marketing pages to be previewed without running
an application server by compiling the templates in ``templates/pages``
into distributable HTML counterparts at the repository root.
"""
from __future__ import annotations

from pathlib import Path

from jinja2 import Environment, FileSystemLoader

TEMPLATES_ROOT = Path(__file__).resolve().parent.parent / 'templates'
OUTPUT_ROOT = Path(__file__).resolve().parent.parent
STATIC_PREFIX = 'static'


def _static_url(filename: str) -> str:
    """Return the relative URL for a static asset."""
    return f"{STATIC_PREFIX}/{filename}" if filename else ''


def _build_environment() -> Environment:
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_ROOT)))
    env.globals.setdefault(
        'url_for',
        lambda endpoint, filename=None, **_: _static_url(filename or ''),
    )
    return env


def render_pages(pages: list[str]) -> None:
    env = _build_environment()

    for page in pages:
        template = env.get_template(f'pages/{page}')
        rendered = template.render()
        (OUTPUT_ROOT / page).write_text(rendered, encoding='utf-8')
        print(f'Rendered {page}')


def main() -> None:
    pages = [
        'index.html',
        'homepage.html',
        'login.html',
    ]
    render_pages(pages)


if __name__ == '__main__':
    main()
