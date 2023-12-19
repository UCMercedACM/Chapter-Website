# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'UCMACM Website'
copyright = '2023, Noelle'
author = 'Noelle'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["sphinxext.opengraph", "sphinx_copybutton"]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'furo'
html_title = "UCMACM Website Docs"
html_static_path = ['_static']

html_theme_options = {
    "dark_css_variables": {
        "color-brand-primary": "#b8c9ff",
        "color-brand-content": "#b8c9ff",
    },
    "light_css_variables": {
        "color-brand-primary": "#38a5ff",
        "color-brand-content": "#38a5ff",
    },
}
