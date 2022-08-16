#!/usr/bin/python3

import os

from http.server import HTTPServer, SimpleHTTPRequestHandler

os.chdir("..")

HOST='127.0.0.1'
PORT = 9000
httpd = HTTPServer( (HOST,PORT), SimpleHTTPRequestHandler )
httpd.serve_forever()
