#!/usr/bin/python3
# -*- coding: utf-8 -*-
#test on python 3.4 ,python of lower version  has different module organization.
# Static file server. "Good enough" to server html/js and markdown to local client.
# 
# Execute like:
# 
# $ python httpServer.py 1>http.log 2>&1 &

# Compatible with python 3.4 and higher versions.

# TODO:(0) Emulate bash code:
# cd $(dirname $0)/../..
# COORDINATE_ZERO=$(pwd)  # <·· USE a well-defined directory for any script

import os, http.server
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import socketserver

PORT = 9000
os.chdir("..")

Handler = http.server.SimpleHTTPRequestHandler
Handler.protocol_version = "HTTP/1.1"
# Handler.close_connection = True

Handler.extensions_map={
        '.wasm': 'application/wasm',
    '.manifest': 'text/cache-manifest',
     '.payload': 'text/plain',
	    '.html': 'text/html', '.png': 'image/png',
	     '.jpg': 'image/jpg',
	     '.svg': 'image/svg+xml',
	     '.css': 'text/css',
	      '.js': 'application/x-javascript',
	      '.md': 'text/markdown',
	      ''   : 'application/octet-stream', # Default
}


print(f"""
- Visit http://localhost:{PORT}/wallet_services "
""")

server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
server.serve_forever()

os.system(f"xdg-open  http://127.0.0.1:{PORT}/txt_world_domination/index.html 1>/dev/null 2>&1 &")
