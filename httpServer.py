#!/usr/bin/python3
# -*- coding: utf-8 -*-
#test on python 3.4 ,python of lower version  has different module organization.
import os, http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

PORT = 9000
os.chdir("..")

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map={
      '.wasm': 'application/wasm',
  '.manifest': 'text/cache-manifest',
	    '.html': 'text/html', '.png': 'image/png',
	     '.jpg': 'image/jpg',
	     '.svg': 'image/svg+xml',
	     '.css': 'text/css',
	      '.js': 'application/x-javascript',
	      '.md': 'text/markdown',
	      ''   : 'application/octet-stream', # Default
    }

httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()
