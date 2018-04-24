import os
import numpy as np
from PIL import Image
import keras
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers.core import Dense,Dropout,Activation, Flatten
from keras.optimizers import SGD, RMSprop, Adam
from keras.layers import Conv2D, MaxPooling2D
def prepicture(picname):
    img = Image.open('./pictures/' + picname)
    new_img = img.resize((300, 300), Image.BILINEAR)
    new_img.save(os.path.join('./pictures/', os.path.basename(picname)))

def read_image2(filename):
    img = Image.open('./pictures/' + filename).convert('RGB')
    return np.array(img)


def f(x):
	    # target = ['布偶猫', '孟买猫', '暹罗猫', '英国短毛猫']
 
    return {
    	0: "暹罗",
    	1: "Bengal",
    	2: "Bombay",
    	3: "英短",
        4: "Egyptian",
        5: "老朱",
        6: "布偶"

    }[x]

def testcat(picname):
    # 预处理图片 变成100 x 100
    prepicture(picname)
    x_test = []

    x_test.append(read_image2(picname))

    x_test = np.array(x_test)

    x_test = x_test.astype('float32')
    x_test /= 255

    keras.backend.clear_session()
    model = Sequential()
    # input: 100x100 images with 3 channels -> (100, 100, 3) tensors.
    # this applies 32 convolution filters of size 3x3 each.
    model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(100,100, 3)))
    model.add(Conv2D(32, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    model.add(Flatten())
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(7, activation='softmax'))

    sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
    model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

    model.load_weights('./oxford_cat_face_weights.h5')
    classes = model.predict_classes(x_test)
    probability = model.predict(x_test)
    probability *= 1000
    actual_list = probability[0]
    result = []
    for i in range(len(actual_list)):
        result.append(round(actual_list[i],3))

    # print(result)
    # print(classes)
    # target = ['布偶猫', '孟买猫', '暹罗猫', '英国短毛猫']
    # print(target[classes])
    return classes[0]

test_images_list = os.listdir("./pictures")


def predict(filename):
 	result = f(testcat(filename))
 	print("这只猫本来是",filename.split(".")[0])
 	print("我xjb猜他是",result)
prepicture("laozhu.jpeg")
# for filename in test_images_list:
#     # print(filename)
#     predict(filename)

# predict("布偶1.jpeg")
# predict("布偶2.jpeg")

# predict('laozhu.jpeg')
# predict("暹罗猫.jpeg")
# predict("孟买猫.jpeg")
# predict("英短.jpeg")
# predict("暹罗2.jpeg")











