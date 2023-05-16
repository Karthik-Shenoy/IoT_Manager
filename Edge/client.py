from coapthon.client.helperclient import HelperClient

client = HelperClient(server=('224.0.1.187', 5683))
response = client.get('hello')
print(response)
client.stop()