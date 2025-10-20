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

PAGE_TARGETS = {
    'index': 'index.html',
    'homepage': 'homepage.html',
    'login': 'login.html',
}


def _static_url(filename: str) -> str:
    """Return the relative URL for a static asset."""
    return f"{STATIC_PREFIX}/{filename}" if filename else ''


def _page_url(name: str | None = None, **_: str) -> str:
    """Return the relative URL for a static page."""

    if not name:
        return ''

    if name in PAGE_TARGETS:
        return PAGE_TARGETS[name]

    if name.endswith('.html'):
        return name

    return f"{name}.html"


def _url_for(endpoint: str, filename: str | None = None, **values: str) -> str:
    """Simplified ``url_for`` replacement for static rendering."""

    if endpoint == 'static':
        return _static_url(filename or values.get('filename', ''))

    if endpoint in ('page', 'pages'):
        return _page_url(values.get('name') or values.get('page'))

    if endpoint.startswith('pages.'):
        return _page_url(endpoint.split('.', 1)[1])

    return _page_url(endpoint)


def _build_environment() -> Environment:
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_ROOT)))
    env.globals.setdefault('url_for', _url_for)
    env.globals.setdefault('page_url', _page_url)
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
