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
import os
import sys
from pprint import pprint # debugging 101

PORT = 9000

server=None

def initialization_function():
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
  global server
  server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)

if __name__ != "__main__":
   print("debug: executing as __main__" )

initialization_function()

# Daemonize the process
if os.fork() > 0:
  URL_BASE="http://127.0.0.1:{PORT}"
  INDEX_PATH="/txt_world_domination/index.html"
  os.system(f"xdg-open {URL_BASE}/{INDEX_PATH} 1>/dev/null 2>&1 &")
  sys.exit()
else:
  os.setsid() # TODO:(0)
  # sys.stdout.flush()
  # sys.stderr.flush()
  # with open('/dev/null', 'rb', 0) as read_null:
  #   with open('/dev/null', 'wb', 0) as write_null:
  #     with open('/dev/null', 'wb', 0) as error_null:
  #       os.dup2(read_null.fileno(), sys.stdin.fileno())
  #       os.dup2(write_null.fileno(), sys.stdout.fileno())
  #       os.dup2(error_null.fileno(), sys.stderr.fileno())
  server.serve_forever()
