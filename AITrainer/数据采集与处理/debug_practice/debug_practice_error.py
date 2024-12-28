import cv2

lena = cv2.imread("image/lena.png", 1)
logo = cv2.imread("images/anaconda.jpg", 1)

h1, w1, ch1 = lena.shape
h2, w2, ch2 = logo.shape
roi = lena[h1-h2:h1, w1:w1-w2]

grey = cv2.cvtColor(logo, cv2.COLOR_BGR2GRAY)

ret, mask1 = cv2.threshold(grey, 220, cv2.THRESH_BINARY)

fg1 = cv2.bitwise_and(roi, roi, mask=mask1)

ret, mask2 = cv2.threshold(grey, 220, 255, cv2.THRESH_BINARY_INV)

fg2 = cv2.bitwise_and(logo, logo, mask=mask2)

roi[:] = cv2.add(fg1, fg2)
cv2.imshow('roi2', roi, mask2)

cv2.waitKey(0)
cv2.destroyAllWindows()