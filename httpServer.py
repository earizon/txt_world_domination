#!/usr/bin/python3

from os import chdir,fork,environ

from http.server import HTTPServer, SimpleHTTPRequestHandler

HOST='0.0.0.0'
port = 9000
httpd = HTTPServer( (HOST,port), SimpleHTTPRequestHandler )
httpd.serve_forever()
