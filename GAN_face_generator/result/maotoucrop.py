from PIL import Image
import os
#image_list = os.list_dir("./")
#for image in image_list:
#    img = Image.open(image)
#    img2 = img.crop((113, 35, 331, 253))
#    img2.save(image)
image = "3004006.png"
img = Image.open(image)
img2 = img.crop((113, 35, 331, 253))
img2.save(image)
image = "3004007.png"
img = Image.open(image)
img2 = img.crop((113, 35, 331, 253))
img2.save(image)
image = "3003005.png"
img = Image.open(image)
img2 = img.crop((113, 35, 331, 253))
img2.save(image)

