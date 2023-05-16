from coapthon.server.coap import CoAP
from coapthon.resources.resource import Resource

class HelloWorld(Resource):
    def __init__(self, name="HelloWorld", coap_server=None):
        super(HelloWorld, self).__init__(name, coap_server, visible=True, observable=True, allow_children=True)
        self.payload = "Hello World!"

    def render_GET(self, request):
        return self

class CoAPServer(CoAP):
    def __init__(self, host, port):
        CoAP.__init__(self, (host, port), multicast=True)
        self.add_resource('hello/', HelloWorld())

if __name__ == '__main__':
    server = CoAPServer("0.0.0.0", 5683)
    try:
        server.listen(10)
    except KeyboardInterrupt:
        print("Server Shutdown")
        server.close()
        print("Exiting...")
