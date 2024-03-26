#include "point_triangle_distance.h"
#include <Eigen/Geometry>

void point_triangle_distance(
	const Eigen::RowVector3d& x,
	const Eigen::RowVector3d& a,
	const Eigen::RowVector3d& b,
	const Eigen::RowVector3d& c,
	double& d,
	Eigen::RowVector3d& p)
{
	//https://stackoverflow.com/questions/14467296/barycentric-coordinate-clamping-on-3d-triangle
	//https://people.cs.clemson.edu/~dhouse/courses/404/notes/barycentric.pdf
	Eigen::RowVector3d n;
	double u, v, w, t, A;
	A = ((c - b).cross(b - a)).norm();
	n = ((c - b).cross(b - a)).normalized();
	u = ((c - b).cross(x - b)).dot(n / A);
	v = ((a - c).cross(x - c)).dot(n / A);
	w = 1 - u - v;
	p = u * a + v * b + w * c;
	d = (x - p).norm();
	if (v >= 0 && u >= 0 && (u + v) <= 1) {
		return;
	}
	else if (u <= 0) {
		t = (p - b).dot(c - b) / (c - b).dot(c - b);

		if (t > 1) {
			t = 1.0f;
		}
		else if (t < 0) {
			t = 0.0f;
		}
		u = 0.0f, v = 1.0f - t, w = t;  
	}
	else if (v <= 0) {

		t = (p - c).dot(a - c) / (a - c).dot(a - c);

		if (t > 1) {
			t = 1.0f;
		}
		else if (t < 0) {
			t = 0.0f;
		}
		u = t, v = 0.0f, w = 1.0f - t;

	}
	else if ((u + v) >= 1) {
		t = (p - a).dot(b - a) / (b - a).dot(b - a);

		if (t > 1) {
			t = 1.0f;
		}
		else if (t < 0) {
			t = 0.0f;
		}
		u = 1.0f - t, v = t, w = 0.0f;
	}

	p = u * a + v * b + w * c;
	d = (x - p).norm();
}
